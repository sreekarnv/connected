from fastapi import Depends

from connected_identity.db.connection import get_session

DbSession = Depends(get_session)
