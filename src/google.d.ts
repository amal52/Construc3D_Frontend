declare namespace gapi {
  interface Auth {
    getToken(): {
      access_token: string;
    } | null;
  }

  interface Client {
    init(params: {
      apiKey: string;
      discoveryDocs?: string[];
    }): Promise<void>;
    getToken(): {
      access_token: string;
    } | null;
    drive: {
      files: {
        create(params: any): Promise<any>;
        list(params: any): Promise<any>;
        get(params: {
          fileId: string;
          alt?: string;
        }, options?: {
          responseType?: string;
        }): Promise<{
          body: Blob;
          headers: {
            'content-type': string;
            'content-disposition'?: string;
          };
        }>;
      };
    };
  }

  interface Auth2 {
    getAuthInstance(): {
      isSignedIn: {
        get(): boolean;
        listen(callback: (isSignedIn: boolean) => void): void;
      };
      signIn(options?: {
        scope?: string;
        prompt?: string;
      }): Promise<any>;
      signOut(): Promise<void>;
      currentUser: {
        get(): {
          getAuthResponse(includeAuthorizationData?: boolean): {
            access_token: string;
            id_token?: string;
            scope?: string;
            expires_in?: number;
            first_issued_at?: number;
            expires_at?: number;
          };
        };
      };
    };
    init(params: {
      client_id: string;
      scope: string;
    }): Promise<void>;
  }

  const auth: Auth;
  const client: Client;
  const auth2: Auth2;
  
  function load(apiName: string, callback: () => void): void;
}

declare namespace google.accounts.oauth2 {
  interface TokenClient {
    callback: (response: TokenResponse) => void;
    requestAccessToken(params?: {
      prompt?: '' | 'consent' | 'select_account';
    }): void;
  }

  interface TokenResponse {
    access_token: string;
    error?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }

  function initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
    error_callback?: (error: Error) => void;
  }): TokenClient;
}

declare namespace google.picker {
  const Action: {
    PICKED: string;
    CANCEL: string;
  };
  
  const Response: {
    ACTION: string;
    DOCUMENTS: string;
  };
  
  const ViewId: {
    DOCS: string;
    DOCS_IMAGES: string;
    DOCS_VIDEOS: string;
    SPREADSHEETS: string;
    PRESENTATIONS: string;
  };

  class View {
    constructor(viewId: string);
    setMimeTypes(mimeTypes: string): View;
  }

  class PickerBuilder {
    addView(view: View | string): PickerBuilder;
    setOAuthToken(token: string): PickerBuilder;
    setDeveloperKey(key: string): PickerBuilder;
    setCallback(callback: (data: PickerResponse) => void): PickerBuilder;
    build(): Picker;
    setVisible(visible: boolean): void;
  }

  interface Picker {
    setVisible(visible: boolean): void;
    isVisible(): boolean;
    dispose(): void;
  }

  interface PickerResponse {
    action: string;
    docs: Array<{
      id: string;
      name: string;
      mimeType: string;
      type: string;
      lastEditedUtc: number;
      iconUrl: string;
      url: string;
      embedUrl: string;
      downloadUrl: string;
      description: string;
      sizeBytes: number;
    }>;
  }
}