import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Icon, Label, SemanticICONS, SemanticCOLORS } from 'semantic-ui-react';
import { ChannelEntity } from '../entities/ChannelEntity';
import { ChannelAvatar, ChannelAvatarSize } from './ChannelAvatar';
import { isPublicChannel } from './ChannelHelpers';
import { isMusicChannel, isVideoChannel, isAccountAChannelOwner } from './ChannelHelpers';
import { useMyMembership } from '@polkadot/joy-utils/MyMembershipContext';

type ChannelPreviewProps = {
  channel: ChannelEntity
  size?: ChannelAvatarSize
  withDescription?: boolean
};

export const ChannelPreview = (props: ChannelPreviewProps) => {
  const { myAccountId } = useMyMembership();
  const { channel, size, withDescription } = props;

  let subtitle: string | undefined;
  let icon: 'music' | 'film' | undefined;

  if (isMusicChannel(channel)) {
    subtitle = 'Music channel',
    icon = 'music'
  } else if (isVideoChannel(channel)) {
    subtitle = 'Video channel'
    icon = 'film'
  }

  let visibilityIcon: SemanticICONS = 'eye';
  let visibilityColor: SemanticCOLORS = 'green';
  let visibilityText = 'Public';

  if (!isPublicChannel(channel)) {
    visibilityIcon = 'eye slash';
    visibilityColor = 'orange';
    visibilityText = 'Unlisted';
  }

  return <>
    <div className={`ChannelPreview ${size || ''}`}>

      <ChannelAvatar channel={channel} size={size} />

      <div className='ChannelDetails'>
        <h2 className='ChannelTitle' style={{ display: 'block' }}>
          
          <Link to={`/media/channels/${channel.id}`} style={{ marginRight: '1rem' }}>
            {channel.title}
          </Link>

          {isAccountAChannelOwner(channel, myAccountId) &&
            <div style={{ float: 'right' }}>

              <Link to={`/media/channels/${channel.id}/edit`} className='ui button basic' style={{ marginRight: '1rem' }}>
                <i className='icon pencil' />
                Edit
              </Link>
              
              <Link to={`/media/channels/${channel.id}/upload`} className='ui button basic primary'>
                <i className='icon upload' />
                Upload {channel.content}
              </Link>
            </div>
          }
        </h2>

        {subtitle &&
          <div className='ChannelSubtitle'>

            <span style={{ marginRight: '1rem' }}>
              {icon && <i className={`icon ${icon}`} />}
              {subtitle}
            </span>

            <Label basic color={visibilityColor} style={{ marginRight: '1rem' }}>
              <Icon name={visibilityIcon} />
              {visibilityText}
            </Label>

            {channel.curationStatus !== 'Normal' &&
              <Label basic color='red'>
                <Icon name='dont' />
                Channel {channel.curationStatus}
                {' '}<Icon name='question circle outline' size='small' />
              </Label>
            }
          </div>
        }

        {withDescription &&
          <ReactMarkdown className='JoyMemo--full' source={channel.description} linkTarget='_blank' />
        }
      </div>

      {/* // TODO uncomment when we calculate reward and count of videos in channel: */}
      {/* <ChannelStats channel={channel} /> */}

    </div>
  </>
}
