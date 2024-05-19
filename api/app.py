from fastapi import FastAPI
from verbecc import Conjugator

app = FastAPI()

@app.get('/conjugate/{lang}/{verb}')
async def conjugate(lang: str, verb: str):
  verb = verb.replace("+", " ")
  cj = Conjugator(lang)
  conjugation = cj.conjugate(verb)
  return conjugation
