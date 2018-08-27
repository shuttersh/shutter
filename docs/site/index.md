---
layout: layout/page
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


