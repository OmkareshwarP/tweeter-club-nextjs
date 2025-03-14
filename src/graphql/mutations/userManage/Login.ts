import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($userIdentifier: String!, $provider: String!, $deviceInfo: String, $operatingSystem: String) {
    login(
      userIdentifier: $userIdentifier
      provider: $provider
      deviceInfo: $deviceInfo
      operatingSystem: $operatingSystem
    ) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        isNewUser
        token
      }
    }
  }
`;
