import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const STAFF_ROLES = [
  "admin",
  "salesManager",
  "sales",
  "accountant",
  "warehouse",
];

// كل دور وداشبورده
const ROLE_HOME: Record<string, string> = {
  admin: "/dashboard",
  accountant: "/dashboard-accountant",
  warehouse: "/dashboard-warehouse",
  sales: "/dashboard-sales",
  salesManager: "/dashboard-salesmanger",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. قراءة بيانات تسجيل الدخول
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const role = token?.role as string | undefined;
  const isStaff = !!role && STAFF_ROLES.includes(role); // admin / accountant / warehouse
  const staffHome = ROLE_HOME[role ?? ""]; // داشبورد الموظف (بيتستخدم لو isStaff بس)

  // بيطابق كل الداشبوردات (/dashboard و /dashboard-accountant و /dashboard-warehouse)
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // هل الموظف جوه الداشبورد بتاعه هو؟ (بدون ما /dashboard يطابق /dashboard-accountant)
  const isOwnDashboard =
    isStaff && (pathname === staffHome || pathname.startsWith(`${staffHome}/`));

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forget-password");

  // 2. كل موظف يدخل على الداشبورد بتاعه فقط (أي مسار تاني يتحول له)
  if (isStaff && !isOwnDashboard) {
    return NextResponse.redirect(new URL(staffHome, request.url));
  }

  // 3. حماية الـ Dashboard - للموظفين فقط
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isStaff) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. إذا كان المستخدم مسجل دخول وحاول يفتح صفحة login/register
  if (isAuthenticated && isAuthRoute) {
    const destination = isStaff ? staffHome : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 5. حماية صفحات المستخدم الخاصة
  const protectedRoutes = [
    "/profile",
    "/checkout",
    "/allorders",
    "/cart",
    "/wishlist",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // استثناء الملفات الثابتة والـ API من الفحص
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)",
  ],
};
