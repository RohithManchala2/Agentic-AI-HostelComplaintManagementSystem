from typing import Literal

from pydantic import BaseModel, Field


class ComplaintOutput(BaseModel):
    title: str = Field(
        description="Short complaint title"
    )

    description: str = Field(
        description="Detailed complaint description"
    )

    category: Literal[
        "Electrical",
        "Plumbing",
        "Carpentry",
        "Internet",
        "Cleaning",
        "Other"
    ]