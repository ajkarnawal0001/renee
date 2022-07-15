export interface IPayload {
  'https://hasura.io/jwt/claims': {
    'x-hasura-role': string;
    'x-hasura-user-id': string;
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
  };
}

export interface IAuthResponse {
  accessToken: string;
  data: {
    user_id: string;
    role: string;
  };
}
