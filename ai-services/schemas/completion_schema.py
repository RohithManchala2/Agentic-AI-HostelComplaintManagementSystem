from pydantic import BaseModel, Field


class CompletionSchema(BaseModel):
    room_number: str = Field(
        description="Room number whose complaint is completed"
    )