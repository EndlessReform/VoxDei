# llama.cpp startup convenience script

NOTE: this is for testing and local development. Please actually use TGI for production!

## Prerequisites

1. Install [llama.cpp](https://github.com/ggerganov/llama.cpp) to `~/.local/bin`:
   ```bash
   git clone git@github.com:ggerganov/llama.cpp.git
   ```
2. Compile for your system. For example, for Nvidia:

   ```bash
   cd ~/.local/bin/llama.cpp
   LLAMA_CUBLAS=1 make
   ```

3. Download requisite model to `/models`. Make sure it's the right one! You can do this any way you want but consider creating a venv and then using [huggingface-cli](https://huggingface.co/docs/huggingface_hub/main/en/guides/cli).

4. Copy the service to `~/.config/systemd/user`; run `systemctl --user daemon-reload`

## Usage

For openhermes:

```bash
systemctl --user start openhermes.service
systemctl --user stop openhermes.service

# Check status
systemctl --user status openhermes.service
```
