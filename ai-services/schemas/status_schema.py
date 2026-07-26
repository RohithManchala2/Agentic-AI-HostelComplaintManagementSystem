from typing import Literal,Optional
from pydantic import BaseModel,Field

class StatusOutput(BaseModel):
    """
    Structured Output for Complaint Status Agent
    """
    query_type:Literal[
        "latest",
        "all",
        "pending",
        "resolved",
        "in_progress",
        "specific"
    ] = Field(description="Type of complaint status request.")

    keyword: Optional[str] = Field(
        default=None,
        description="Complaint keyword when user refers to a specific complaint (e.g., fan, wifi, tap)."
    )