import React from 'react';
import {
  NerdGraphQuery,
  UserStorageMutation,
  EntityStorageMutation,
  NerdletStateContext,
  PlatformStateContext,
  Spinner,
  BlockText,
  HeadingText
} from 'nr1';
import { get } from 'lodash';
import { VIVIDCORTEX_URL } from '../../CONFIGURE_ME';
import ConfigureMe from '../../components/configureme';
import SetupUserToken from '../../components/setup';
import VCMain from '../../components/main';
import { getTimeInterval } from '../../lib/time';

export default class VividCortexNerdlet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.callbacks = {
      setUserToken: this.setUserToken.bind(this),
      setVCHosts: this.setVCHosts.bind(this),
      openConfig: this.openConfig.bind(this),
      closeConfig: this.closeConfig.bind(this)
    };
    this.state = {
      openConfig: false
    };
  }

  openConfig() {
    this.setState({ openConfig: true });
  }

  closeConfig() {
    this.setState({ openConfig: false });
  }

  async setUserToken(userToken) {
    if (userToken) {
      const mutation = {
        actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'vividcortex',
        documentId: 'userToken',
        document: { userToken }
      };
      await UserStorageMutation.mutate(mutation);
    } else {
      const mutation = {
        actionType: UserStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
        collection: 'vividcortex',
        documentId: 'userToken'
      };
      await UserStorageMutation.mutate(mutation);
    }
    this.setState({ updated: true }); // eslint-disable-line react/no-unused-state
  }

  async setVCHosts(vcHosts, entityGuid) {
    // debugger;
    const mutation = {
      entityGuid,
      actionType: EntityStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: 'vividcortex',
      documentId: 'vcHosts'
    };
    if (!vcHosts) {
      mutation.actionType = EntityStorageMutation.ACTION_TYPE.DELETE_DOCUMENT
    } else {
      mutation.document = { vcHosts };
    }
    console.debug(mutation);
    await EntityStorageMutation.mutate(mutation);
    this.setState({ updated: true }); // eslint-disable-line react/no-unused-state
  }

  _initNerdGraphQuery(entityGuid) {
    return `{
      actor {
        nerdStorage {
          userToken: document(collection: "vividcortex", documentId: "userToken")
        }
        entity(guid: "${entityGuid}") {
          name domain type account { name id }
          nerdStorage {
            vcHosts: document(collection: "vividcortex", documentId: "vcHosts")
          }
        }
      }
    }`;
  }

  render() {
    if (!VIVIDCORTEX_URL) {
      return <ConfigureMe />;
    }
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => {
              const { timeRange } = platformUrlState;
              const { from, until } = getTimeInterval(timeRange);
              const { entityGuid } = nerdletUrlState;
              return (
                <NerdGraphQuery
                  fetchPolicyType={NerdGraphQuery.FETCH_POLICY_TYPE.NO_CACHE}
                  query={this._initNerdGraphQuery(entityGuid)}
                >
                  {({ loading, error, data }) => {
                    if (loading) {
                      return <Spinner fillContainer />;
                    }
                    if (error) {
                      return (
                        <div>
                          <HeadingText>An unexpected error occurred</HeadingText>
                          <BlockText>{error.message}</BlockText>
                        </div>
                      );
                    }
                    console.log(data);
                    const userToken = get(
                      data,
                      'actor.nerdStorage.userToken.userToken'
                    );
                    const vcHosts = get(
                      data,
                      'actor.entity.nerdStorage.vcHosts.vcHosts'
                    );
                    const osHost = vcHosts
                      ? vcHosts.find(h => h.type === 'os')
                      : null;
                    const entity = get(data, 'actor.entity');
                    if (!entity) {
                      return <>
                    <HeadingText>Unable to load entity for ${entityGuid}</HeadingText>
                      </>
                    }

                    const propSet = {
                      osHost,
                      vcHosts,
                      userToken,
                      from,
                      until,
                      entityGuid,
                      entity,
                      callbacks: this.callbacks,
                      openConfig: this.state.openConfig
                    };
                    if (!userToken) {
                      return <SetupUserToken {...propSet} />;
                    }
                    return <VCMain {...propSet} />;
                  }}
                </NerdGraphQuery>
              );
            }}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}
