import { Album } from "@/components/artist/components/tabs/albums-tab/components/album";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useUserData } from "@/hooks/use-user-data";
import { deleteRequest } from "@/server/actions/request";
import {
  editTrackById,
  getTracksByIds,
  getTracksData,
} from "@/server/actions/track";
import { type RootState } from "@/state/store";
import { handleToastPromise } from "@/utils/toast-promise";
import { useQuery } from "@tanstack/react-query";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";

export function FeatureRequestsTab() {
  const { data: requests } = useSelector((state: RootState) => state.requests);
  const user = useUserData();
  const requestsLength = requests?.length ?? 0;
  const { data } = useQuery({
    queryKey: ["feat-requests-data"],
    queryFn: async () => {
      const tracks =
        requestsLength > 0
          ? await getTracksByIds({
              ids: requests?.map((request) => request.trackId),
            })
          : [];
      const tracksData = requestsLength
        ? await getTracksData({ tracks })
        : { authors: [], playlists: [] };
      return { tracks, ...tracksData };
    },
  });
  const acceptHandler = async (trackId: string) => {
    await handleToastPromise(
      async () => {
        await editTrackById({
          data: { authorIds: { push: user.id } },
          id: trackId,
        });
        const request = requests?.find(
          (request) => request.trackId === trackId,
        );
        if (!request) return;
        await deleteRequest(request?.id);
      },
      {
        loading: "accepting request...",
        success: "accepted request successfully!",
        error: "error while accepting, please try again.",
      },
    );
  };
  const declineHandler = async (trackId: string) => {
    await handleToastPromise(
      async () => {
        const request = requests?.find(
          (request) => request.trackId === trackId,
        );
        if (!request) return;
        await deleteRequest(request?.id);
      },
      {
        loading: "declining request...",
        success: "declined request successfully!",
        error: "error while declining, please try again.",
      },
    );
  };
  return (
    <div className="container mx-auto p-8">
      <div className="mb-10 flex flex-col">
        <h1 className="text-3xl font-bold">Feature Requests</h1>
        <p className="text-muted-foreground">
          The latest feature requests from artists.
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="flex flex-col gap-4">
        {data ? (
          data.tracks?.map((track) => (
            <Album
              viewAs="list"
              artist={data?.authors?.find(
                (artist) => track.authorId === artist.id,
              )}
              key={track.id}
              track={track}
              addType
              buttons={
                <div className="flex gap-2">
                  <Button
                    className="flex gap-2"
                    onClick={async (e) => {
                      e.currentTarget.disabled = true;
                      await acceptHandler(track.id);
                    }}
                  >
                    <FaCheck /> Accept
                  </Button>
                  <Button
                    className="flex gap-2"
                    variant="destructive"
                    onClick={async (e) => {
                      e.currentTarget.disabled = true;
                      await declineHandler(track.id);
                    }}
                  >
                    <FaX /> Decline
                  </Button>
                </div>
              }
            />
          ))
        ) : (
          <Loading className="h-fit" />
        )}
      </div>
    </div>
  );
}
