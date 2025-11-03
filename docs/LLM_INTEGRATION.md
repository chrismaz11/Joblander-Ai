# LLM Integration — Providers and configuration

This project supports multiple LLM providers. The server will auto-detect and use the first available provider unless you explicitly set `LLM_PROVIDER`.

Supported providers (recommended, free tier options):

- Hugging Face Inference API (recommended free-tier option)
  - Env vars:
    - `HUGGINGFACE_API_KEY` or `HF_API_KEY`
    - Optional: `HUGGINGFACE_MODEL` (default: `google/flan-t5-large`)
  - Notes: Hugging Face offers a free tier for many inference models. Pick an instruction-tuned model (flan, instruct, falcon-instruct) for best results.

- OpenAI (if you have a key)
  - Env vars:
    - `OPENAI_API_KEY`
    - Optional: `OPENAI_MODEL` (defaults to `gpt-4o-mini` in code)
  - Notes: High-quality but paid. If present, OpenAI will be used by default.

Selection logic (server-side)
- If `LLM_PROVIDER` is set to `openai`/`huggingface` that provider is used.
- If `LLM_PROVIDER` is empty, the server uses OpenAI when `OPENAI_API_KEY` is present; otherwise it uses Hugging Face when `HUGGINGFACE_API_KEY` is present.

How to enable Hugging Face (quick)
1. Create a Hugging Face account and get an API token: https://huggingface.co/settings/tokens
2. Set `HUGGINGFACE_API_KEY` in your Vercel/production envs (and locally in `.env` for dev).
3. Optionally set `HUGGINGFACE_MODEL` to a preferred model (e.g., `google/flan-t5-large`, `tiiuae/falcon-7b-instruct` if available).

Example envs (Vercel):
```
HUGGINGFACE_API_KEY=hf_XXXXXXXXXXXXXXXXXXXX
HUGGINGFACE_MODEL=google/flan-t5-large
LLM_PROVIDER=huggingface    # optional
```

Security and cost
- Monitor usage in your Hugging Face account. Even free tiers have limits. Set usage caps or quotas per user if you plan to expose generation broadly.

If you want other providers (Anthropic, Ollama, Gemini) wired in, I can add them — tell me which keys you have and I will add provider detection.
