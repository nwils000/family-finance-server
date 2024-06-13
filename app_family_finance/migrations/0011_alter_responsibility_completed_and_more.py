# Generated by Django 5.0.6 on 2024-06-12 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_family_finance', '0010_responsibility_completed_responsibility_difficulty_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='responsibility',
            name='completed',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='responsibility',
            name='difficulty',
            field=models.IntegerField(choices=[(1, 'Super Easy'), (2, 'Easy'), (3, 'Medium'), (4, 'Hard'), (5, 'Very Hard'), (6, 'Extreme')]),
        ),
        migrations.AlterField(
            model_name='responsibility',
            name='verified',
            field=models.BooleanField(),
        ),
    ]
