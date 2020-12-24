import fetch from 'node-fetch'

interface IPostParams {
  path: Array<string|number>
  body: object
  authorization: string
}

class BasicAPIManager {
  baseURI: string
  constructor({ baseURI }: { baseURI: string }) {
    // Base URI for doing the requests
    this.baseURI = baseURI
  }

  async post({ path, body, authorization }: IPostParams) {
    const result = await fetch(this.baseURI + `/${path.join('/')}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization
      }
    })
    return await result.json()
  }
}

export { BasicAPIManager }