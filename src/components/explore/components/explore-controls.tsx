import { type TrackSliceType } from "@/state/slices/tracks";
import { FollowButton } from "./follow-button";
import { AddToLibraryButton } from "./add-to-library-button";
import { ShareButton } from "./share-button";
import { TrackMoreButton } from "@/components/components/track-more-button";

type ExploreControlsProps = {
  currentItemData?: TrackSliceType;
  isExploreFetchLoading: boolean;
};

export function ExploreControls({
  currentItemData,
  isExploreFetchLoading,
}: ExploreControlsProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <FollowButton
        isExploreFetchLoading={isExploreFetchLoading}
        currentItemData={currentItemData}
      />
      <AddToLibraryButton
        isExploreFetchLoading={isExploreFetchLoading}
        currentItemData={currentItemData}
      />
      <ShareButton
        isExploreFetchLoading={isExploreFetchLoading}
        currentItemData={currentItemData}
      />
      <TrackMoreButton
        disable={isExploreFetchLoading}
        playlist={currentItemData?.album}
        track={currentItemData?.track}
        className="mt-2"
      />
    </div>
  );
}
