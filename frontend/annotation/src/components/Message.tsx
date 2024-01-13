import {
  Badge,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  Icon,
  IconButton,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { Message as IMessage } from "../hooks/useConvo";
import {
  MachineLearningModel,
  NetworkEnterprise,
  PaintBrush,
  Save,
  TrashCan,
  Undo,
  UserAvatarFilledAlt,
} from "@carbon/icons-react";
import { useConvoStore } from "../hooks/useConvo";

const PromptDisplay = ({
  content,
  message_id,
  message,
}: {
  content: { prompt?: string; prompts?: string[]; size: string };
  message_id: string;
  /** Yes, this is dumb. We're doing it for type reasons */
  message: IMessage;
}) => {
  const promptArray =
    "prompts" in content
      ? content.prompts
      : content.prompt
        ? [content.prompt]
        : [];
  const updateMessage = useConvoStore((state) => state.updateMessage);
  const saveMessage = useConvoStore((state) => state.saveMessage);

  return (
    <Box
      borderRadius={16}
      maxW="2xl"
      border={"1px"}
      borderColor={
        message.metadata.edit_status == "deleted" ? "red.100" : "gray.100"
      }
      p={4}
    >
      <Stack divider={<StackDivider borderColor="gray.200" />}>
        {promptArray?.map((c, k) => (
          <Editable
            key={k}
            my={2}
            defaultValue={c}
            onChange={(prompt) => {
              let newPrompts = promptArray;
              newPrompts[k] = prompt;
              updateMessage(message_id, {
                ...message,
                content: { ...content, prompts: newPrompts, prompt: undefined },
                metadata: {
                  ...message.metadata,
                  edit_status: "edited",
                },
              });
            }}
          >
            <EditablePreview />
            <EditableTextarea minH={40} minW="2xl" />
          </Editable>
        ))}
      </Stack>
      <Flex alignItems={"center"} mt={3}>
        <Icon as={PaintBrush} color="green.600" size={"14px"} mr={1} />
        <Badge>{content.size}</Badge>
        <Spacer />
        <IconButton
          as={Save}
          variant="ghost"
          aria-label="Save"
          size={"1"}
          color={"gray"}
          mr={2}
          onClick={() => saveMessage(message_id, message)}
        />
        <IconButton
          as={message.metadata.edit_status === "deleted" ? Undo : TrashCan}
          variant="ghost"
          aria-label="Trash"
          size={"1"}
          color="red.300"
          onClick={() =>
            saveMessage(message_id, {
              ...message,
              metadata: {
                ...message.metadata,
                edit_status:
                  message.metadata.edit_status == "deleted"
                    ? "edited"
                    : "deleted",
              },
            })
          }
        />
      </Flex>
    </Box>
  );
};

const Message = ({
  message,
  message_id,
}: {
  message: IMessage;
  message_id: string;
}) => {
  const author = message.author;
  const updateMessage = useConvoStore((state) => state.updateMessage);
  const saveMessage = useConvoStore((state) => state.saveMessage);

  // Yes, it's stupid that I can't just define the typeguards as a variable. This is the compiler's fault.
  return (
    <Flex>
      {author.role === "user" && (
        <Flex
          borderRadius={"50%"}
          bgColor={"blue.400"}
          ml={"auto"}
          mr={3}
          mt={2}
          h={8}
          w={8}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icon as={UserAvatarFilledAlt} color="white" w={6} h={6} />
        </Flex>
      )}
      {typeof message.content === "string" ? (
        <>
          <Box
            p={4}
            bg={
              message.metadata?.edit_status === "deleted"
                ? "red.50"
                : author.role === "user"
                  ? "blue.50"
                  : author.role === "assistant"
                    ? "gray.100"
                    : undefined
            }
            border={author.role === "tool" ? "1px" : undefined}
            borderColor={"gray.100"}
            borderRadius={16}
            maxW="2xl"
          >
            <Editable
              defaultValue={message.content}
              onChange={(content) =>
                updateMessage(message_id, {
                  ...message,
                  content,
                  metadata: {
                    ...message.metadata,
                    edit_status: "edited",
                    // Save the original content if it's not already saved
                    original_content:
                      message.metadata?.edit_status === "original" &&
                      typeof message.content === "string"
                        ? message.content
                        : message.metadata?.original_content,
                  },
                })
              }
            >
              <EditablePreview />
              <EditableTextarea minW={"2xl"} resize={"none"} minH={"320px"} />
            </Editable>
            <Stack direction="row" mt={2}>
              <IconButton
                as={Save}
                variant="ghost"
                aria-label="Save"
                size={"1"}
                color={author.role === "user" ? "blue.200" : "gray"}
                onClick={() => saveMessage(message_id, message)}
              />
              <IconButton
                as={
                  message.metadata.edit_status === "deleted" ? Undo : TrashCan
                }
                variant="ghost"
                aria-label="Trash"
                size={"1"}
                color="red.300"
                onClick={() =>
                  saveMessage(message_id, {
                    ...message,
                    metadata: {
                      ...message.metadata,
                      edit_status:
                        message.metadata.edit_status == "deleted"
                          ? "edited"
                          : "deleted",
                    },
                  })
                }
              />
            </Stack>
          </Box>
        </>
      ) : typeof message.content === "object" && "size" in message.content ? (
        <PromptDisplay
          content={message.content}
          message={message}
          message_id={message_id}
        />
      ) : (
        <Text ml={4} color="black">
          Images generated{" "}
          <Text color="gray.500" as="span">
            {" "}
            | Seeds: {message.content?.join(", ")}
          </Text>
        </Text>
      )}
      {author.role === "assistant" ? (
        <Flex
          borderRadius={"50%"}
          bgColor={"black"}
          ml={3}
          mt={2}
          h={8}
          w={8}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icon as={MachineLearningModel} color="white" w={6} h={6} />
        </Flex>
      ) : author.role === "tool" && !Array.isArray(message.content) ? (
        <Flex
          borderRadius={"50%"}
          bgColor={"gray.400"}
          ml={3}
          mt={2}
          h={8}
          w={8}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icon as={NetworkEnterprise} color="white" w={6} h={6} />
        </Flex>
      ) : null}
    </Flex>
  );
};

export default Message;
