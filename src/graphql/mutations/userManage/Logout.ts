import { gql } from '@apollo/client';

export const LOGOUT = gql`
  mutation Logout($userId: String!) {
    logout(userId: $userId) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
      }
    }
  }
`;
