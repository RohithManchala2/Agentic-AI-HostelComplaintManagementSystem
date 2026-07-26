from typing import Literal, Optional

from pydantic import BaseModel, Field


class AssignmentOutput(BaseModel):
    """
    Structured output for Assignment Agent.
    """

    action: Literal[
        "view",
        "assign",
        "reassign"
    ] = Field(
        description="The assignment action requested by the user."
    )

    complaint_keyword: Optional[str] = Field(
        default=None,
        description="Keyword identifying the complaint, such as fan, wifi, tap, light."
    )

    technician_name: Optional[str] = Field(
        default=None,
        description="Technician name if explicitly mentioned by the user."
    )

    assignment_strategy: Optional[
        Literal[
            "named",
            "best_available"
        ]
    ] = Field(
        default=None,
        description="How the technician should be selected."
    )