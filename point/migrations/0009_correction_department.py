# Generated by Django 4.1.4 on 2023-06-22 02:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('point', '0008_alter_correction_day_alter_correction_month_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='correction',
            name='department',
            field=models.CharField(default='', max_length=100),
        ),
    ]