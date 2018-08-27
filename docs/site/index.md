---
layout: layout/default
title: Home
tags: home
---

# Guides

<ul class="teaser-links">
  {%- for guide in collections.guide -%}
    <li>
      <h6>
        <a href="{{ guide.url }}">{{ guide.data.title }}</a>
      </h6>
      <p>{{ guide.data.description }}</p>
    </li>
  {%- endfor -%}
</ul>

# Package API

<ul class="teaser-links">
  {%- for package in collections.package -%}
    <li>
      <h6>
        <a href="{{ package.url }}">{{ package.data.title }}</a>
      </h6>
      <p>{{ package.data.description }}</p>
    </li>
  {%- endfor -%}
</ul>
