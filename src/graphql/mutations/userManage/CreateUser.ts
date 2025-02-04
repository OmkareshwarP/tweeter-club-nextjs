import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $provider: String!
    $verificationStatus: String!
    $name: String!
    $username: String!
    $profilePictureMediaId: String
    $signUpIpv4Address: String
  ) {
    createUser(
      email: $email
      provider: $provider
      verificationStatus: $verificationStatus
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
