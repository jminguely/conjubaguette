from fastapi import FastAPI, Query
from verbecc import Conjugator

app = FastAPI()

@app.get('/conjugate/')
async def conjugate(lang: str = Query(...), verb: str = Query(...)):
    cj = Conjugator(lang)
    conjugation = cj.conjugate(verb)
    return conjugation
