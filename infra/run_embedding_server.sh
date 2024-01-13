model=jinaai/jina-embeddings-v2-base-en
revision=refs/pr/25
volume=$PWD/data # share a volume with the Docker container to avoid downloading weights every run

docker run --gpus all -p 8080:80 -v $volume:/data --pull always ghcr.io/huggingface/text-embeddings-inference:0.3.0 --model-id $model --revision $revision
