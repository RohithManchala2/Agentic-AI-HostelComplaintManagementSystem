from typing import TypedDict, NotRequired


class AgentState(TypedDict):

    message: str

    history: NotRequired[str]

    cookies: dict

    intent: NotRequired[str]

    complaint: NotRequired[dict]

    status_query: NotRequired[dict]

    assignment_query: NotRequired[dict]

    completion_query: NotRequired[dict]

    rag_query: NotRequired[dict]

    response: NotRequired[dict]