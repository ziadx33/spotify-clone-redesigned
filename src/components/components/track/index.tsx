"use client";

import { useState, memo } from "react";
import { type TrackProps } from "./types";
import { PlaysRow } from "./plays-row";
import { SelectCheckbox } from "./components/select-checkbox";
import { Duration } from "./components/duration";
import { AlbumLinkCell } from "./components/album-link-cell";
import { TrackContainer } from "./components/track-container";
import { AuthorsContainer } from "./components/authors-container";

function Comp(props: TrackProps) {
  const {
    isAlbum,
    showImage = true,
    replacePlaysWithPlaylist = false,
    showIndex = true,
    replaceDurationWithButton,
    hidePlayButton = false,
    hideViews,
    className,
    skeleton,
    viewAs,
    selected,
    setSelectedTracks,
    queueTypeId,
    hideTrackContext,
  } = props;

  const [showButtons, setShowButtons] = useState(false);

  return (
    <TrackContainer
      selected={selected}
      setShowButtons={setShowButtons}
      skeleton={skeleton}
      track={!skeleton ? props.track : undefined}
      hidePlayButton={hidePlayButton}
      playlist={!skeleton ? props.playlist : undefined}
      album={!skeleton ? props.album : undefined}
      hideTrackContext={hideTrackContext}
    >
      <AuthorsContainer
        authors={!skeleton ? props.authors : undefined}
        viewAs={viewAs}
        playlist={!skeleton ? props.playlist : undefined}
        queueTypeId={queueTypeId}
        showButtons={showButtons}
        skeleton={props.skeleton}
        album={!props.skeleton ? props.album : undefined}
        track={!props.skeleton ? props.track : undefined}
        className={className}
        showImage={showImage}
        showIndex={showIndex}
        hidePlayButton={hidePlayButton}
        isAlbum={isAlbum}
      />
      <AlbumLinkCell
        skeleton={skeleton}
        track={!skeleton ? props.track : undefined}
        album={!skeleton ? props.album : undefined}
        isAlbum={isAlbum}
      />
      <PlaysRow
        hidePlayButton={hidePlayButton}
        hideViews={hideViews}
        isAlbum={isAlbum}
        skeleton={skeleton}
        album={!skeleton ? props.album : undefined}
        track={!skeleton ? props.track : undefined}
        replacePlaysWithPlaylist={replacePlaysWithPlaylist}
      />
      <Duration
        playlist={!skeleton ? props.playlist : undefined}
        skeleton={skeleton}
        replaceDurationWithButton={replaceDurationWithButton}
        track={!skeleton ? props.track : undefined}
        hideTrackContext={hideTrackContext}
      />
      <SelectCheckbox
        track={!skeleton ? props.track : undefined}
        selected={selected}
        showButtons={showButtons}
        skeleton={skeleton}
        setSelectedTracks={setSelectedTracks}
      />
    </TrackContainer>
  );
}

export const Track = memo(Comp);
