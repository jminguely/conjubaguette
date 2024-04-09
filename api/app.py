from fastapi import FastAPI
from verbecc import Conjugator

app = FastAPI()
cj = Conjugator("fr")

@app.get('/conjugate/{verb}')
async def conjugate(verb: str):
    conjugation = cj.conjugate(verb)
    return conjugation
