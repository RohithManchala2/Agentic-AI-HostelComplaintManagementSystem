import httpx

from config.settings import settings


async def complete_complaint(
    completion_query: dict,
    cookies=None,
):
    """
    Marks a complaint as resolved.

    Only the logged-in technician assigned to the
    complaint is allowed to complete it.
    """

    room = completion_query["room_number"]

    async with httpx.AsyncClient() as client:

        response = await client.put(
            f"{settings.BACKEND_URL}/api/complaint/complete",
            json={
                "room": room,
            },
            cookies=cookies,
        )

        response.raise_for_status()

        result = response.json()

        if not result.get("success"):
            raise Exception(
                result.get(
                    "message",
                    "Failed to complete complaint.",
                )
            )

        return result