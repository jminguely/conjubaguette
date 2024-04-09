from fastapi import FastAPI
from verbecc import Conjugator

application = FastAPI()
cj = Conjugator("fr")

@application.get('/conjugate/{verb}')
async def conjugate(verb: str):
    conjugation = cj.conjugate(verb)
    return conjugation
