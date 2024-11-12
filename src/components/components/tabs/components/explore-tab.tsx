import { useDispatch } from "react-redux";
import { Tab } from "./tab";
import { HiSparkles } from "react-icons/hi2";
import { type AppDispatch } from "@/state/store";
import { editExploreData } from "@/state/slices/explore";

export function ExploreTab() {
  const dispatch = useDispatch<AppDispatch>();
  const clickHandler = () => {
    dispatch(
      editExploreData({ randomly: true, albums: [], authors: [], tracks: [] }),
    );
  };
  return (
    <Tab
      title="Explore"
      onClick={clickHandler}
      Icon={HiSparkles}
      iconSize={22}
      href={"/explore"}
    />
  );
}
