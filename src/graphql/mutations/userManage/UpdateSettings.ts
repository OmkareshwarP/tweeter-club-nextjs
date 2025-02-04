import { gql } from '@apollo/client';

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($theme: String) {
    updateSettings(theme: $theme) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
