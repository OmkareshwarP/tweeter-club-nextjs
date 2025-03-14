import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser(
    $userIdentifier: String!
    $provider: String!
    $name: String!
    $username: String!
    $profilePictureMediaId: String
    $signUpIpv4Address: String
  ) {
    createUser(
      userIdentifier: $userIdentifier
      provider: $provider
      name: $name
      username: $username
      profilePictureMediaId: $profilePictureMediaId
      signUpIpv4Address: $signUpIpv4Address
    ) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
