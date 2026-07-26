import json

from services.groq_service import llm

from prompts.completion_formatter_prompt import (
    COMPLETION_FORMATTER_PROMPT,
)


async def format_completion_response(data: dict):
    """
    Converts backend completion responses into
    natural language.
    """

    response = llm.invoke(
        [
            ("system", COMPLETION_FORMATTER_PROMPT),
            (
                "human",
                json.dumps(
                    data,
                    indent=2,
                    default=str,
                ),
            ),
        ]
    )

    return response.content