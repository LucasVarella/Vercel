# Generated by Django 4.1.4 on 2023-05-15 22:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('point', '0003_remove_point_date_time_point_day_point_hour_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='point',
            old_name='hour',
            new_name='time',
        ),
    ]