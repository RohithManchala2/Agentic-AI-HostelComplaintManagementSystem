from typing import Optional

from pydantic import BaseModel, Field


class RagOutput(BaseModel):
    """
    Structured output for the RAG Agent.
    """

    question: str = Field(
        ...,
        description="The user's hostel-related question."
    )

    category: Optional[str] = Field(
        default=None,
        description=(
            "Optional category of the question. "
            "Examples: Hostel Rules, Leave Policy, "
            "Mess, Fees, WiFi, Visitors, General."
        ),
    )