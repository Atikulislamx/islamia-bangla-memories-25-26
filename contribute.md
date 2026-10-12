---
layout: page
title: "Contribute a Memory"
eyebrow: "Get involved"
lede: >-
  How members of the batch can suggest a memory, an event, a quotation or a
  photograph for the archive — and what happens to a submission afterwards.
permalink: /contribute/
description: >-
  How to contribute a memory, event, quotation or photograph to the Department
  of Bengali memory archive, and how submissions are reviewed before publication.
search_include: true
---
{%- assign contribute = site.data.contribute -%}

{% if contribute.status.automated_submissions == false %}
{% include notice.html variant="warning" title="Submissions are not automated yet" body=contribute.status.automated_message %}
{% endif %}

## What you can contribute

<ul class="card-grid card-grid--contribute">
{%- for type in contribute.content_types %}
  <li class="card-grid__item">
    <article class="card">
      <div class="card__body">
        <h3 class="card__title"><a class="card__link" href="{{ type.url | relative_url }}">{{ type.title }}</a></h3>
        <p class="card__excerpt">{{ type.body }}</p>
      </div>
    </article>
  </li>
{%- endfor %}
</ul>

## How a submission is handled

<ol class="timeline timeline--steps">
{%- for step in contribute.review_steps %}
  <li class="timeline__item">
    <div class="timeline__marker" aria-hidden="true"></div>
    <div class="timeline__content">
      <h3 class="timeline__title">{{ step.title }}</h3>
      <p class="timeline__description">{{ step.body | strip_newlines | strip }}</p>
    </div>
  </li>
{%- endfor %}
</ol>

## Where to send it

{% if contribute.contact.available %}
<p>
  Submissions for this archive go to <strong>{{ contribute.contact.value }}</strong>.
</p>
{% else %}
{% include notice.html variant="warning" title="Contribution channel not configured yet" body=contribute.contact.note %}
{% endif %}

<p>
  The contribution channel is recorded in a single configuration file
  (<code>_data/contribute.yml</code>) so that it can be published here as soon as
  the batch agrees on it. No contact address is invented on this page, and no
  data is collected by the website itself.
</p>

## Before you send anything

- **Only your own material.** Memories, reflections and photographs you took or
  wrote yourself, or material you have explicit permission to share.
- **Consent first.** If a friend, a teacher or a classmate appears in a
  photograph or a story, ask them before sending it.
- **Nothing private.** No phone numbers, addresses, student identification
  numbers, results or private messages.
- **Accuracy.** Dates, names and spellings matter. “Approximate” is a perfectly
  good answer when you are not sure.
- **Read the policy.** The Privacy Policy explains what publication means in
  practice, including what cannot be undone once something is public.

<div lang="bn" class="prose">
<p>
স্মৃতি, উক্তি, অনুষ্ঠানের তথ্য বা ছবি পাঠানোর আগে অনুগ্রহ করে নিশ্চিত করুন যে
তথ্যটি সত্যি এবং আপনার নিজের লেখা বা তোলা — অথবা পাঠানোর অনুমতি আপনার আছে।
ছবিতে যাঁরা আছেন, তাঁদের সম্মতি নেওয়া জরুরি। ফোন নম্বর, ঠিকানা, রোল নম্বর বা
ফলাফলের মতো ব্যক্তিগত তথ্য পাঠাবেন না। সংশয় থাকলে তারিখ বা বানান “আনুমানিক”
হিসেবে লিখে দিন — সেটাই যথেষ্ট।
</p>
</div>

{% if site.sample_content %}
{% include notice.html variant="sample" title="About the placeholder entries" body=site.sample_notice %}
{% endif %}
