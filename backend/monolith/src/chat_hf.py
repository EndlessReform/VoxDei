from datetime import datetime
from fastapi import FastAPI, Depends
from fastapi.responses import StreamingResponse
import json
from pydantic import BaseModel
from dependencies.shared_state import get_shared_state

MODEL = "laura-mistral7b-v0.1"


# Completions
class TextCompletionRequest(BaseModel):
    model: str
    prompt: str | list[str]
    max_tokens: int = 128
    stream: bool = False


class Message(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    model: str
    messages: list[Message]
    frequency_penalty: float | None = None
    max_tokens: int = 512
    n: int | None = 1
    stop: str | list[str] | None = ["<|im_end|>"]
    temperature: float | None = 0.7
    stream: bool = False


app = FastAPI()


def format_data_for_stream(dictionary):
    """Make data ready for streaming as SSE"""
    return f"data: {json.dumps(dictionary)}\n\n"


def get_timestamp():
    """Convenience function for getting the current timestamp"""
    return int(datetime.now().timestamp())


@app.post("/completions")
async def post_completion(
    completion_request: TextCompletionRequest,
    shared_state=Depends(get_shared_state),
):
    def get_basic_response(text):
        return {
            "id": "foobar",
            "object": "text_completion",
            "created": get_timestamp(),
            "model": MODEL,
            "choices": [
                {
                    "text": text,
                    "index": 0,
                    "logprobs": None,
                    "finish_reason": None,
                }
            ],
        }

    state = shared_state.get_state()

    def streaming_response(prompt):
        for token in state["hf_client"].text_generation(
            prompt,
            max_new_tokens=completion_request.max_tokens,
            stream=True,
        ):
            yield format_data_for_stream(get_basic_response(token))
        yield f"data: [DONE]\n\n"

    if completion_request.stream:
        return StreamingResponse(
            streaming_response(completion_request.prompt),
            media_type="text/eventstream",
        )

    else:
        response = state["hf_client"].text_generation(
            completion_request.prompt, max_new_tokens=completion_request.max_tokens
        )
        return {
            **get_basic_response(response),
            "usage": {
                # TODO: Calculate these
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0,
            },
        }


@app.post("/chat/completions")
def post_chat_completion(
    completion_request: ChatCompletionRequest,
    get_shared_state=Depends(get_shared_state),
):
    """
    Non-streaming chat completion
    """
    # Convert the messages to a prompt
    state = get_shared_state.get_state()
    # TODO: Move this over to the tgi-api! (if possible)
    chat_tokens = state["tokenizer"].apply_chat_template(completion_request.messages)
    formatted_prompt = (
        state["tokenizer"].decode(chat_tokens) + "\n<|im_start|> assistant\n"
    )

    def make_response(delta, is_last=False):
        return {
            "id": "foobar",
            "object": "chat.completion.chunk",
            "created": get_timestamp(),
            "model": MODEL,
            "choices": [
                {
                    "index": 0,
                    "delta": delta,
                    "finish_reason": None if not is_last else "stop",
                }
            ],
        }

    def answer_request():
        # Announce role of the first message
        yield format_data_for_stream(
            make_response(
                {
                    "role": "assistant",
                    "content": None,
                }
            )
        )

        maybe_end_tokens = []
        real_end_tokens = ["<", "|", "im", "_", "end", "|", ">"]

        for token in state["hf_client"].text_generation(
            formatted_prompt,
            max_new_tokens=completion_request.max_tokens,
            stream=True,
            stop_sequences=completion_request.stop,
            temperature=completion_request.temperature,
        ):
            if len(maybe_end_tokens) > 0:
                # Check if the token is the next token in the end sequence
                if token == real_end_tokens[len(maybe_end_tokens)]:
                    if len(maybe_end_tokens) == len(real_end_tokens) - 1:
                        # End sequence found!
                        yield format_data_for_stream(
                            make_response(
                                {},
                                is_last=True,
                            )
                        )
                        return
                    else:
                        maybe_end_tokens.append(token)
                else:
                    # print("False alarm, sending tokens")
                    for t in maybe_end_tokens:
                        yield format_data_for_stream(
                            make_response(
                                {
                                    "content": t,
                                }
                            )
                        )
                    maybe_end_tokens = []
            # Dirty hack until we make the LaURA tokenizer smarter
            elif "<" in token:
                # Start of a possible end sequence
                yield format_data_for_stream(
                    make_response(
                        {
                            "content": token.split("<")[0],
                        }
                    )
                )
                maybe_end_tokens.append("<")
            else:
                yield format_data_for_stream(
                    make_response(
                        {
                            "content": token,
                        }
                    )
                )
        # Finish the response (if it hasn't been finished yet)
        yield format_data_for_stream(make_response({}, is_last=True))

    if completion_request.stream:
        return StreamingResponse(answer_request(), media_type="text/eventstream")
    else:
        # Generate the response
        response = state["hf_client"].text_generation(
            formatted_prompt,
            max_new_tokens=completion_request.max_tokens,
            stop_sequences=completion_request.stop,
            temperature=completion_request.temperature,
        )

        answer = response.split("<|im_end|>")[0].strip()
        # TODO: Convert the response to a message
        return {
            # TODO: Generate a real ID
            "id": "foobar",
            "object": "chat.completion",
            "created": get_timestamp(),
            "model": MODEL,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": answer,
                    },
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": len(chat_tokens),
                # TODO: Calculate these
                "completion_tokens": 0,
                "total_tokens": len(chat_tokens),
            },
        }
