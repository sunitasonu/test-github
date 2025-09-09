import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  List,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Calendar,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  UserPlus,
  Package,
  Calculator,
  CreditCard,
  TrendingUp,
  Shield,
  Carrot,
  Tractor,
  Receipt,
  FileSpreadsheet,
  UserCog,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// At the top of AppSidebar.jsx

// At the top of AppSidebar.jsx
import { useSidebar } from "@/components/ui/use-sidebar";
import { cn } from "@/lib/utils"; // Adjust the import path as needed
const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  // const [openInvoices, setOpenInvoices] = useState(true);
  // const [openCustomers, setOpenCustomers] = useState(true);
  // const [openProducts, setOpenProducts] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const [openMasters, setOpenMasters] = useState(false);
  // const [openAdmin, setOpenAdmin] = useState(false);
  const [openAavak, setOpenAavak] = useState(false);
  const [openSale, setOpenSale] = useState(false);
  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    // { icon: TrendingUp, label: "Financial Dashboard", path: "/dashboard" },
    // { icon: BarChart3, label: "Analytics", path: "/analytics" },
    // { icon: Calendar, label: "Calendar", path: "/calendar" },
    // { icon: Mail, label: "Messages", path: "/messages" },
    // { icon: Settings, label: "Settings", path: "/settings" },
    // { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  // const invoiceItems = [
  //   // { icon: List, label: "All Invoices", path: "/invoices" },
  //   // { icon: Plus, label: "Create Invoice", path: "/invoices/create" },
  // ];

  // const customerItems = [
  //   // { icon: Users, label: "All Customers", path: "/customers" },
  //   // { icon: UserPlus, label: "Add Customer", path: "/customers/create" },
  //   // { icon: List, label: "Customer Directory", path: "/customer-directory" },
  // ];

  const aavakItems = [
    { icon: FileSpreadsheet, label: "Aavak List", path: "/aavak" },
    {
      icon: CreditCard,
      label: "Aavak Payment",
      path: "/aavak/payment",
    },

    // {
    //   icon: List,
    //   label: "Sale Create",
    //   path: "/sale/create",
    // },
    // {
    //   icon: List,
    //   label: "Aavak Payment History",
    //   path: "/aavak/payment-history/1",
    // },
    // { icon: Plus, label: "Create Aavak", path: "/aavak/create" },
    // { icon: Plus, label: "Create Aavak (Alt)", path: "/aavak/create-alt" },
  ];
  const saleItems = [
    { icon: FileText, label: "Sale List", path: "/sale" },
    {
      icon: CreditCard,
      label: "Sale Payment",
      path: "/sale/payment",
    },
    { icon: CreditCard, label: "Sale Create", path: "/sale/create" },
    { icon: FileText, label: "Sale List", path: "/sale" },
  ];

  // const productItems = [
  //   { icon: Package, label: "Product Catalog", path: "/products" },
  //   { icon: Calculator, label: "Tax Rates", path: "/tax-master" },
  // ];

  const paymentItems = [
    { icon: CreditCard, label: "Record Payment", path: "/payments" },
    { icon: List, label: "Payment History", path: "/payment" },
  ];

  const masterItems = [
    { icon: Carrot, label: "Vegetable Master", path: "/vegetables" },
    { icon: Tractor, label: "Farmer Master", path: "/farmers" },
    { icon: Users, label: "Customer Master", path: "/customers" },
    { icon: UserCog, label: "User Management", path: "/users" },
    { icon: Calculator, label: "Tax Master", path: "/tax-master" },
  ];

  // const adminItems = [
  //   // { icon: Shield, label: "User Management", path: "/users" },
  //   // { icon: Settings, label: "System Settings", path: "/system-settings" },
  // ];

  // const isActive = (path) => {
  //   if (path === "/") return location.pathname === "/";
  //   return location.pathname.startsWith(path);
  // };

  // // const isInvoiceActive = () => location.pathname.startsWith("/invoices");
  // // const isCustomerActive = () =>
  // //   location.pathname.startsWith("/customers") ||
  // //   location.pathname.startsWith("/customer-directory");
  // const isAavakActive = () =>
  //   location.pathname.startsWith("/aavak") ||
  //   location.pathname.startsWith("/aavak/payment") ||
  //   location.pathname.startsWith("/sale/create");
  // // const isProductActive = () =>
  // //   location.pathname.startsWith("/products") ||
  // //   location.pathname.startsWith("/tax-master");
  // const isPaymentActive = () =>
  //   location.pathname.startsWith("/payments") ||
  //   location.pathname.startsWith("/payment");
  // const isMasterActive = () =>
  //   location.pathname.startsWith("/vegetables") ||
  //   location.pathname.startsWith("/farmers") ||
  //   location.pathname.startsWith("/customers") ||
  //   location.pathname.startsWith("/users") ||
  //   location.pathname.startsWith("/tax-master");
  // // const isAdminActive = () =>
  // //   location.pathname.startsWith("/users") ||
  // //   location.pathname.startsWith("/system-settings");

  const isActive = (path, exact = false) => {
    if (path === "/") return location.pathname === "/";
    return exact
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const isPathActive = (paths, exact = false) => {
    if (!Array.isArray(paths)) paths = [paths];
    return paths.some((p) => isActive(p, exact));
  };
  const isPaymentActive = () => isPathActive(["/payments", "/payment"]);
  const isAavakActive = () => isPathActive(["/aavak", "/aavak/payment"]);

  const isSaleActive = () =>
    isPathActive(["/sale", "/sale/payment", "/sale/create"]);
  const isMasterActive = () =>
    isPathActive([
      "/vegetables",
      "/farmers",
      "/customers",
      "/users",
      "/tax-master",
    ]);

  // For submenu items (exact match)
  const isSubActive = (path) => isActive(path, true);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-2 py-2">
          <div
            className=" rounded-lg  flex items-center justify-center"
            style={{ width: "30px", height: "30px" }}
          >
            <img
              src="/logo-color.png" // your logo file in public folder
              alt="Logo"
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          {state === "expanded" && (
            <span className="text-xl font-bold text-sidebar-foreground">
              SabajiMandi
            </span>
          )}
        </div>

        {/* <div className="flex items-center space-x-2 py-2 overflow-hidden">
          <div
            className="rounded-lg flex items-center justify-center"
            style={{ width: "30px", height: "30px" }}
          >
            <img
              src="/logo-color.png"
              alt="Logo"
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <span
            className={cn(
              "text-xl font-bold text-sidebar-foreground whitespace-nowrap transition-all duration-300",
              state === "expanded"
                ? "opacity-100 w-auto ml-2"
                : "opacity-0 w-0 ml-0"
            )}
          >
            SabajiMandi
          </span>
        </div> */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={state === "collapsed" ? item.label : undefined}
                    className={
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : ""
                    }
                  >
                    <NavLink to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Aavak Section */}
              <SidebarMenuItem>
                <Collapsible open={openAavak} onOpenChange={setOpenAavak}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isAavakActive()}
                      tooltip={state === "collapsed" ? "Aavak" : undefined}
                      className={
                        isAavakActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                      }
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Aavak</span>
                      {state === "expanded" &&
                        (openAavak ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {aavakItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive(item.path)}
                              // className={
                              //   isSubActive(item.path)
                              //     ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                              //     : "text-black [&>svg]:text-black hover:text-primary-foreground hover:text-white dark:text-white hover:[&>svg]:text-white "
                              // }
                              // className={
                              //   isSubActive(item.path)
                              //     ? // Active state
                              //       "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                              //     : // Inactive state
                              //       "text-black [&>svg]:text-black hover:text-primary-foreground hover:[&>svg]:text-primary-foreground dark:text-white dark:[&>svg]:text-white dark:hover:text-primary-foreground dark:hover:[&>svg]:text-primary-foreground"
                              // }

                              className={
                                isSubActive(item.path)
                                  ? // Active state
                                    "bg-primary/80 text-primary-foreground [&>svg]:text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground"
                                  : // Inactive state
                                    " hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4 hover:[&>svg]:text-white" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              {/* Sale Section */}
              <SidebarMenuItem>
                <Collapsible open={openSale} onOpenChange={setOpenSale}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isSaleActive()}
                      tooltip={state === "collapsed" ? "Aavak" : undefined}
                      className={
                        isSaleActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                      }
                    >
                      <FileText className="h-4 w-4" />
                      <span>Sale</span>
                      {state === "expanded" &&
                        (openAavak ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {saleItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive(item.path)}
                              className={
                                isSubActive(item.path)
                                  ? // Active state
                                    "bg-primary/80 text-primary-foreground [&>svg]:text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground"
                                  : // Inactive state
                                    " hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4 hover:[&>svg]:text-white" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              {/* Payments Section */}
              {/* <SidebarMenuItem>
                <Collapsible open={openPayments} onOpenChange={setOpenPayments}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isPaymentActive()}
                      tooltip={state === "collapsed" ? "Payments" : undefined}
                      className={
                        isPaymentActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                      }
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Payments</span>
                      {state === "expanded" &&
                        (openPayments ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {paymentItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive(item.path)}
                              className={
                                isSubActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : "hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem> */}

              {/* Masters Section */}
              <SidebarMenuItem>
                <Collapsible open={openMasters} onOpenChange={setOpenMasters}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isMasterActive()}
                      tooltip={state === "collapsed" ? "Masters" : undefined}
                      className={
                        isMasterActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                      }
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Masters</span>
                      {state === "expanded" &&
                        (openMasters ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {masterItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive(item.path)}
                              className={
                                isSubActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : "hover:bg-primary/70 hover:text-primary-foreground hover:[&>svg]:text-primary-foreground text-black [&>svg]:text-black dark:text-white dark:[&>svg]:text-white"
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
