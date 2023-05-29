import React, { useEffect, useState } from "react";
import "./header.scss";
import SearchIcon from "@mui/icons-material/Search";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { connect } from "react-redux";
import { auth } from "../../firebase/firebase";
import { useHistory } from "react-router-dom";
import { searchInputAction } from "../../store/actions";
import { Link } from "react-router-dom";
import LinkMUI from "@mui/material/Link";
import BrandLogo from "../../assets/Brand_Logo.png";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  List,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  Badge,
  Button,
  Divider,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ChevronLeft,
  Expand,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

function Header2({
  processing,
  firstName,
  searchInputAction,
  searchInput,
  setSearchInput,
  productList,
}) {
  //const [productList, setProductList] = useState(0);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const history = useHistory();

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleAuth = () => {
    auth.signOut();
    history.push("/");
  };

  const handleAccount = () => {
    history.push("/myaccount");
  };

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchinput = () => {
    searchInputAction(searchInput);
  };

  useEffect(() => {
    const listener = window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [windowWidth]);

  return (
    <div className="header">
      <div className="header-content">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            open={open}
            position="static"
            color="transparent"
            style={{ boxShadow: "none" }}
          >
            <Toolbar>
              <IconButton
                size="medium"
                edge="start"
                aria-label="drawer"
                onClick={handleDrawer}
                sx={{ display: { xs: "block", sm: "none" } }}
                open={!open && windowWidth < 600}
              >
                <MenuIcon />
              </IconButton>
              <Link
                className="brand__name"
                to="/home"
                aria-disabled={processing ? true : false}
                onClick={() => {
                  searchInputAction("");
                  setSearchInput("");
                }}
              >
                <img className="brand_logo" src={BrandLogo} />
              </Link>
              <div className="search__bar">
                <SearchIcon
                  onClick={handleSearchinput}
                  className="search__button"
                />
                <input
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                  type="text"
                  placeholder="Search product name here..."
                  className="search__input"
                />
              </div>
              <div className="user__auth">
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="white"
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  <PersonOutlineOutlinedIcon fontSize="large" />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  open={anchorEl}
                  onClose={handleClose}
                  sx={{ mt: "50px", ml: "30px" }}
                >
                  <MenuItem onClick={handleAccount}>
                    <AccountCircleRoundedIcon sx={{ mr: "5px" }} /> My Profile
                  </MenuItem>
                  <MenuItem onClick={handleAuth}>
                    <LogoutIcon sx={{ mr: "5px" }} /> Logout
                  </MenuItem>
                </Menu>
              </div>
              <LinkMUI
                className="cart__icon"
                //aria-disabled={processing ? true : false}
                href="/checkout"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Badge badgeContent={productList?.length} color="error">
                  <LocalMallOutlinedIcon
                    style={{ pointerEvents: `${processing ? "none" : ""}` }}
                    fontSize="large"
                    htmlColor="white"
                  />
                </Badge>
              </LinkMUI>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: "100vw",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "100vw",
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open && windowWidth < 600}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <IconButton onClick={handleDrawer}>
                <ChevronLeft color="action" />
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem onClick={handleSubMenu} key="Account" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                  {subMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={subMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    onClick={handleAccount}
                    key="MyAccount"
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountCircleRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary="My Profile" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={handleAuth} key="Logout" disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
              <Divider />
              <ListItem key="Cart" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LocalMallOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cart" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        </Box>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    firstName: state.users,
  };
};

export default connect(mapStateToProps, { searchInputAction })(Header2);
