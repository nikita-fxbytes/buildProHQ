import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ConstructionIcon from "@mui/icons-material/Construction";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HandymanIcon from "@mui/icons-material/Handyman";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MicNoneIcon from "@mui/icons-material/MicNone";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ComponentType } from "react";

type IconName =
  | "search"
  | "filters"
  | "delete"
  | "complete"
  | "add"
  | "edit"
  | "folder"
  | "quick"
  | "logout"
  | "email"
  | "fieldUser"
  | "tradeUser"
  | "manager"
  | "mic"
  | "clipboard"
  | "listening"
  | "arrowRight"
  | "sortAsc"
  | "sortDesc"
  | "close"
  | "actionItems"
  | "addActionItem"
  | "completedItems"
  | "manageFilters"
  | "users"
  | "addUser"
  | "assignedTasks"
  | "myCompleted"
  | "logoutSidebar"
  | "photos";

const ICON_MAP = {
  search: SearchIcon,
  filters: SettingsIcon,
  delete: DeleteOutlineIcon,
  complete: CheckCircleOutlineIcon,
  add: AddIcon,
  edit: EditOutlinedIcon,
  folder: FolderOpenIcon,
  quick: FlashOnIcon,
  logout: ArrowBackIcon,
  email: EmailOutlinedIcon,
  fieldUser: ConstructionIcon,
  tradeUser: HandymanIcon,
  manager: DashboardCustomizeIcon,
  mic: MicNoneIcon,
  clipboard: ContentPasteIcon,
  listening: GraphicEqIcon,
  arrowRight: ArrowForwardIcon,
  sortAsc: ArrowUpwardIcon,
  sortDesc: ArrowDownwardIcon,
  close: CloseIcon,
  actionItems: AssignmentOutlinedIcon,
  addActionItem: AddCircleOutlineIcon,
  completedItems: TaskAltOutlinedIcon,
  manageFilters: TuneIcon,
  users: GroupOutlinedIcon,
  addUser: PersonAddAltOutlinedIcon,
  assignedTasks: BuildCircleOutlinedIcon,
  myCompleted: CheckCircleOutlineIcon,
  logoutSidebar: LogoutOutlinedIcon,
  photos: PhotoCameraOutlinedIcon,
} as const satisfies Record<IconName, ComponentType<{ sx?: SxProps<Theme> }>>;

export type AppIconProps = {
  name: IconName;
  size?: number;
  sx?: SxProps<Theme>;
};

export function AppIcon({ name, size = 14, sx }: AppIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon sx={{ fontSize: `${size}px`, verticalAlign: "middle", ...(sx || {}) }} />;
}

