interface error {
    message: string
    code?: number
}

export class HTTPException extends Error {
    public code
    public date
    
    constructor(params: error) {
        super(params.message)

        if (Error.captureStackTrace) {
        Error.captureStackTrace(this, HTTPException)
        }

        this.name = 'HTTPException'
        // Custom debugging information
        this.code = params.code ?? 500
        this.date = new Date()
    }
}
