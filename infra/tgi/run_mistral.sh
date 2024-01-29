model=jkeisling/laura-mistral
volume=$PWD/data # share a volume with the Docker container to avoid downloading weights every run

docker run --gpus all --shm-size 1g -p 8800:80 -v $volume:/data ghcr.io/huggingface/text-generation-inference:sha-82f87ad --model-id $model --quantize bitsandbytes-nf4
