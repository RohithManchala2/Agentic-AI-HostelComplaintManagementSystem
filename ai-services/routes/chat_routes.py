import logging

from fastapi import APIRouter, Request

from models.chat_request import ChatRequest
from graph.workflow import graph

from memory.chat_history import (
    add_message,
    format_history,
)

router = APIRouter(prefix="/chat", tags=["Chat"])

logger = logging.getLogger("ai-service")


@router.post("")
async def chat(request: Request, body: ChatRequest):

    logger.info("[AI][IN] %s %s", request.method, request.url.path)
    logger.info("[AI][BODY] %s", body.model_dump())

    try:

        cookies = dict(request.cookies)

        logger.info("[AI][COOKIES] %s", list(cookies.keys()))

        # -------------------------------------------------
        # Thread ID
        # -------------------------------------------------

        # Temporary thread id
        # Later we'll use user id or session id
        thread_id = "test-user"

        # -------------------------------------------------
        # Previous Conversation
        # -------------------------------------------------

        history = format_history(thread_id)

        # -------------------------------------------------
        # Graph State
        # -------------------------------------------------

        state = {
            "message": body.message,
            "history": history,
            "cookies": cookies,
        }

        config = {
            "configurable": {
                "thread_id": thread_id
            }
        }

        # -------------------------------------------------
        # Invoke Graph
        # -------------------------------------------------

        result = await graph.ainvoke(
            state,
            config=config
        )

        # -------------------------------------------------
        # Save Conversation
        # -------------------------------------------------

        add_message(
            thread_id,
            "User",
            body.message,
        )

        add_message(
            thread_id,
            "Assistant",
            str(result.get("response")),
        )

        return {
            "success": True,
            "intent": result.get("intent"),
            "response": result.get("response"),
        }

    except Exception as exc:

        logger.exception("[AI][ERR] chat request failed")

        return {
            "success": False,
            "intent": None,
            "response": {
                "success": False,
                "message": "Sorry, I couldn't process that request right now.",
                "error": str(exc),
            },
        }