from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from together import Together

# 🔹 Initialize FastAPI app
app = FastAPI()

# 🔹 Initialize Together.AI client (Replace with your actual API Key)
client = Together(api_key="d266b19d3d5f080b55d40656b9bd85c34a45da6e6c605388e9b65e78d1f19d49")

# 🔹 Request model
class QueryRequest(BaseModel):
    query: str

# 🔹 API Endpoint to Handle Search Queries
@app.post("/ask")
async def ask_ai(request: QueryRequest):
    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": request.query}],
            max_tokens=200,
            temperature=0.7,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1.0,
            stop=["<|eot_id|>", "<|eom_id|>"],
            stream=False  # Turn off streaming for simplicity
        )
        
        # 🔹 Extract AI Response
        ai_response = response.choices[0].message.content
        
        return {"response": ai_response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 🔹 Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
