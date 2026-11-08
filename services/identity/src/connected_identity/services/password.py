from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from starlette.concurrency import run_in_threadpool

_password_hasher = PasswordHasher()
_dummy_password = _password_hasher.hash("dummy password for login timing")


async def hash_password(password: str) -> str:
    return await run_in_threadpool(_password_hasher.hash, password)


def _verify_password(password: str, encoded: str | None) -> bool:
    try:
        return _password_hasher.verify(encoded or _dummy_password, password)
    except (VerificationError, InvalidHashError):
        return False


async def verify_password(password: str, encoded: str | None) -> bool:
    return await run_in_threadpool(_verify_password, password, encoded)
