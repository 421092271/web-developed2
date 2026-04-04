<script setup>
import { onMounted, onUnmounted } from "vue";
import NavbarDefault from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

const body = document.getElementsByTagName("body")[0];

onMounted(() => {
  body.classList.add("bg-gray-200");
});

onUnmounted(() => {
  body.classList.remove("bg-gray-200");
});

const navAction = {
  route: "/presentation",
  color: "bg-gradient-success",
  label: "查看模板页",
};

const footerBrand = {
  name: "连云港兴林机电设备安装有限公司",
  logo: "/favicon.png",
  route: "/",
};

const footerMenus = [
  {
    name: "系统导航",
    items: [
      { name: "首页", href: "/" },
      { name: "模板展示", href: "/presentation" },
      { name: "关于我们", href: "/pages/landing-pages/about-us" },
    ],
  },
  {
    name: "二开建议",
    items: [
      { name: "页面开发", href: "#" },
      { name: "接口联调", href: "#" },
      { name: "权限控制", href: "#" },
    ],
  },
];
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" :action="navAction" />
      </div>
    </div>
  </div>

  <header class="page-header min-vh-50 bg-gradient-dark">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center">
          <h1 class="text-white pt-6">二次开发起始页</h1>
          <p class="lead text-white mt-3">
            当前已从模板切换为业务首页入口，可在此基础上继续扩展菜单、业务页面和接口联调。
          </p>
        </div>
      </div>
    </div>
  </header>

  <main class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
    <section class="container py-5">
      <div class="row mb-4">
        <div class="col-lg-8">
          <h3 class="mb-1">二开结构建议</h3>
          <p class="text-sm mb-0">
            views 放页面、components 放通用组件、services 放 API 请求、stores 管理状态。
          </p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5>业务页面</h5>
              <p class="text-sm">
                在 <code>src/views</code> 下按模块创建页面，如
                <code>orders</code>、<code>customers</code>。
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5>接口层</h5>
              <p class="text-sm">
                使用 <code>src/services</code> 封装 fetch 请求，统一错误处理和超时控制。
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5>路由与权限</h5>
              <p class="text-sm">
                在路由 meta 中定义权限标识，后续可配合 Pinia 或后端 token 实现鉴权。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <DefaultFooter :brand="footerBrand" :menus="footerMenus" :socials="[]" />
</template>
