import Axios, { AxiosResponse } from "axios";
import { createLogger } from "../utils/logger";

let cachedCertificate: string

export default async (jwksUrl: string): Promise<string> => {
    if (cachedCertificate) return cachedCertificate
    try {
        const result: AxiosResponse = await Axios.get(jwksUrl)
        const keys = result.data.keys;

        const signingKeys = keys.filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                    && key.kty === 'RSA' // We are only supporting RSA
                    && key.alg === 'RS256' // R256 algorithm
                    && key.kid           // The `kid` must be present to be useful for later
                    && (key.x5c && key.x5c.length) // Has useful public keys (we aren't using n or e)
            )
        
         if (!signingKeys.length)
            throw new Error('No JWKS signing keys found')
        
        const key = signingKeys[0]
        const pub = key.x5c[0]  // public key

        cachedCertificate = certToPEM(pub)
        return cachedCertificate;
    } catch (error) {
        createLogger('JWT').error(error);
    }
}

function certToPEM(cert: string): string {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}