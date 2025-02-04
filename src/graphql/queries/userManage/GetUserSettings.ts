import { gql } from '@apollo/client';

export const GET_USER_SETTINGS = gql`
  query GetUserSettings {
    getUserSettings {
      error
      message
      statusCode
      errorCodeForClient
      data {
        theme
      }
    }
  }
`;
