import React, { useEffect, useState } from "react";
import "./header.scss";
import SearchIcon from "@mui/icons-material/Search";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { connect } from "react-redux";
import { auth } from "../../firebase/firebase";
import { useHistory } from "react-router-dom";
import { searchInputAction } from "../../store/actions";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import BrandLogo from "../../assets/ProductlyLogo.png";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  List,
  Collapse,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  Badge,
  Divider,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { ChevronLeft, ExpandLess, ExpandMore } from "@mui/icons-material";

function Header({
  processing,
  searchInput,
  setSearchInput,
  productList,
  selectedCategory,
  setSelectedCategory,
  handleCartToggleDrawer,
}) {
  //const [productList, setProductList] = useState(0);

  const [open, setOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(false);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategoryMenuOpen, setSubCategoryMenuOpen] = useState(false);
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
    setProfileAnchorEl(e.currentTarget);
  };

  const handleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const handleSubCategoryMenu = () => {
    setSubCategoryMenuOpen(!subCategoryMenuOpen);
  };

  const handleClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSearchinput = () => {
    searchInputAction(searchInput);
  };

  const handleCategoryClick = (e) => {
    setCategoryAnchorEl(e.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
  };

  function handleCategory(category) {
    setSelectedCategory(category);
    handleCategoryClose();
  }

  useEffect(async () => {
    if (categories.length === 0) {
      try {
        // For Production Purpose
        await api
          .get("/readOnlyCategory")
          .then((res) => setCategories(res.data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [categories.length]);

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
                  if (searchInput !== "") searchInputAction("");
                  if (searchInput !== "") setSearchInput("");
                  if (selectedCategory !== "") setSelectedCategory("");
                }}
              >
                <img alt="Brand__Logo" className="brand_logo" src={BrandLogo} />
              </Link>
              <div className="category__menu">
                <Button
                  aria-controls={open ? "menu-categoryappbar" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleCategoryClick}
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  Category
                </Button>
                <Menu
                  id="menu-categoryappbar"
                  anchorEl={categoryAnchorEl}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  open={Boolean(categoryAnchorEl)}
                  onClose={handleCategoryClose}
                  sx={{ mt: "50px", ml: "80px" }}
                >
                  {categories?.map((category) => (
                    <MenuItem
                      key={category}
                      onClick={() => handleCategory(category)}
                    >
                      <p style={{ textTransform: "capitalize" }}>{category}</p>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
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
                  anchorEl={profileAnchorEl}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  open={profileAnchorEl}
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
              <div className="cart__icon">
                <IconButton
                  size="large"
                  onClick={(event) => handleCartToggleDrawer(true, event)}
                  color="white"
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  <Badge badgeContent={productList?.length} color="secondary">
                    <LocalMallOutlinedIcon fontSize="large" htmlColor="white" />
                  </Badge>
                </IconButton>
              </div>
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
            <ListItem
              onClick={handleSubCategoryMenu}
              key="Category"
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <StorefrontIcon />
                </ListItemIcon>
                <ListItemText primary="Category" />
                {subCategoryMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={subCategoryMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories?.map((category) => (
                  <ListItem
                    onClick={() => handleCategory(category)}
                    key={category}
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <SubdirectoryArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText
                        sx={{ textTransform: "capitalize" }}
                        primary={category}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <Divider />
            <ListItem
              onClick={(event) => handleCartToggleDrawer(true, event)}
              key="Cart"
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <LocalMallOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Cart" />
              </ListItemButton>
            </ListItem>
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

export default connect(mapStateToProps, { searchInputAction })(Header);
