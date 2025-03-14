import { gql } from '@apollo/client';

export const CHECK_USERNAME_STATUS = gql`
  query CheckUsernameStatus($username: String!) {
    checkUsernameStatus(username: $username) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        isUsernameAvailable
      }
    }
  }
`;
