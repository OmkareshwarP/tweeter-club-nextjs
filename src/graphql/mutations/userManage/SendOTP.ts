import { gql } from '@apollo/client';

export const SEND_OTP = gql`
  mutation SendOTP($email: String!) {
    sendOTP(email: $email) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
