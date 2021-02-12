import { Jwt } from "./Jwt";
import Axios, { AxiosResponse } from "axios";
import { createLogger } from "../utils/logger";

export default async (jwksUrl: string, jwt: Jwt): Promise<any> => {
    try {
        const result: AxiosResponse = await Axios.get(jwksUrl)
        const keys = result.data.keys;

        const signingKeys = keys.filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                    && key.kty === 'RSA' // We are only supporting RSA
                    && key.kid           // The `kid` must be present to be useful for later
                    && key.x5c && key.x5c.length // Has useful public keys (we aren't using n or e)
            ).map(key => {
                return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
            });
        
        const signingKey = signingKeys.find(key => key.kid === jwt.header.kid);
        if (!signingKey) {
            throw new Error('signing key not found'); 
        }
        return signingKey;
    } catch (error) {
        createLogger('JWT').error(error);
    }
}

function certToPEM(cert: string): string {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}