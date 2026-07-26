from collections import defaultdict

# Stores conversation history for each session
_chat_history = defaultdict(list)

MAX_HISTORY = 10


def add_message(thread_id: str, role: str, message: str):
    """
    Save one message to the conversation history.
    """

    _chat_history[thread_id].append(
        {
            "role": role,
            "message": message,
        }
    )

    # Keep only recent messages
    if len(_chat_history[thread_id]) > MAX_HISTORY:
        _chat_history[thread_id] = _chat_history[thread_id][-MAX_HISTORY:]


def get_history(thread_id: str):
    """
    Return conversation history.
    """
    return _chat_history.get(thread_id, [])


def format_history(thread_id: str):
    """
    Convert history into text for prompts.
    """

    history = get_history(thread_id)

    if not history:
        return "No previous conversation."

    text = ""

    for item in history:
        text += f"{item['role']}: {item['message']}\n"

    return text


def clear_history(thread_id: str):
    _chat_history.pop(thread_id, None)